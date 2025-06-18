from chromedriver_py import binary_path
from concurrent.futures import ProcessPoolExecutor, as_completed
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
import pandas as pd
import os



#Scrapes data from a list of links
def main() -> None:

    fp = "collated_full.xlsx"

    if os.path.exists(fp):
        df = pd.read_excel(fp)
        print(f"Loaded existing file")
    else:
        schema = {
            "company_name": str,
            "ticker": str,
            "country": str,
            "industry": str,
            "industry_position": int,
            "industry_count": int,
            "last_updated": str,
            "risk_rating": float,
            "risk_assessment": str,
            "description": str
        }
        df = pd.DataFrame(columns=schema).astype(schema)
        print("Starting new file.")


    with open("links.text", "r") as f:
        links = [line.strip() for line in f.readlines()]
    
    num_workers = 10
    start, end = 0, len(links)
    total = end - start
    chunk_size = total // num_workers
    chunks = [
        links[i: min(i + chunk_size - 1, end)]
        for i in range(start, end + 1, chunk_size)
    ]

    all_results = []
    #Sets up concurrent drivers to scrape chunks of links
    with ProcessPoolExecutor(max_workers=num_workers) as executor:
        futures = [executor.submit(open_link_and_scrape, chunk) for chunk in chunks]
        for future in as_completed(futures):
            all_results.extend(future.result())
    
    # Appends results
    df.loc[start:end + 1, :] = all_results
    # Format entries to datetime format
    df["last_updated"] = pd.to_datetime(df["last_updated"], format="mixed", dayfirst=True)
    # Format them back to strings
    df["last_updated"] = df["last_updated"].dt.strftime("%d/%m/%Y")
    #Saves to excel sheet
    df.to_excel(fp, sheet_name="data", index=False)

def open_link_and_scrape(links):
    # Each process gets a list of links to scrape
    svc = webdriver.ChromeService(executable_path=binary_path)
    driver = webdriver.Chrome(service=svc)
    results = []
    for link in links:
        link = link.strip()
        driver.get(link)
        try:
            results.append(get_company_data(driver))
        except Exception as e:
            print(f"Error on {link}: {e}")
    driver.quit()
    return results

def get_company_data(driver):
    name = get_text_from_class(driver, "company-name")
    desc = get_text_from_id(driver, "collapseCompDesc")
    score = float(get_text_from_class(driver, "risk-rating-score"))
    asmt = get_text_from_class(driver, "risk-rating-assessment").removesuffix(" Risk")
    ind = get_text_from_class(driver, "industry-group")
    con = get_text_from_class(driver, "country")
    pos = int(get_text_from_class(driver, "industry-group-position"))
    total = int(get_text_from_class(driver, "industry-group-positions-total"))
    iden = get_text_from_class(driver, "identifier")
    if iden == "-":
        iden = ""
    else:
        iden = iden.split(":")[1]
    dates = get_update_dates(driver)
    if len(dates) == 1:
        last_update = dates[0]
    else:
        last_update = dates[1]
    return name, iden, con, ind, pos, total, last_update, score, asmt, desc

def get_text_from_id(driver, elem_id) -> str:
    try:
        e = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, elem_id)))
        return e.text
    except TimeoutException:
        return ""

def get_text_from_class(driver, classname) -> str:
    try:
        e = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, classname)))
        return e.text
    except TimeoutException:
        return ""

def get_update_dates(driver):
    try:
        update_divs = WebDriverWait(driver, 5).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "update-date"))
        )
        full_update = update_divs[0].find_element(By.TAG_NAME, "strong").text
        if len(update_divs) == 1:
            return (full_update,)
        last_update = update_divs[1].find_element(By.TAG_NAME, "strong").text
        return (full_update, last_update)
    except Exception as e:
        print("Error extracting update dates:", e, "at", driver.current_url)
        return "", ""

if __name__ == "__main__":
    main()
