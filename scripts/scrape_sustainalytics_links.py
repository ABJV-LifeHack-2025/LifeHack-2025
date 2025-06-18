from chromedriver_py import binary_path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time

FILE_PATH = "sustainalytics_links.txt" # Destination to save scraped links


def get_comapnies_on_page():
    # Obtains the list which contains all the company element
    company_link_list = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.ID, "company_ratings"))).find_elements(By.CLASS_NAME, "company-row")
    # Obtain the links from the elements
    return [company_link.find_element(By.TAG_NAME, "a").get_attribute("href") for company_link in company_link_list]

def main() -> None:
    svc = webdriver.ChromeService(executable_path=binary_path)
    global driver
    driver = webdriver.Chrome(service=svc)
    driver.get("https://www.sustainalytics.com/esg-ratings")
    actions = ActionChains(driver)

    # Clear popup on the website
    button_position = WebDriverWait(driver, 100)\
        .until(EC.presence_of_element_located((By.ID, "hs-eu-confirmation-button")))
    button_position.click()
    # Get the page numbers
    page_numbers = WebDriverWait(driver, 10)\
        .until(EC.presence_of_element_located((By.ID, "victor-pagination")))\
        .find_elements(By.TAG_NAME, "a")
    # Get the last page number
    end = int(page_numbers[-1].text)
    start = 1
    initial = True
    # Create the file to append links to 
    with open(FILE_PATH, "a") as f:
        while start != end:
            if not initial:
                # Reduce chances of StaleElementReferenceException due to javascript on the website affecting elements
                WebDriverWait(driver, 100).until(EC.staleness_of(next_page_element))
                WebDriverWait(driver, 100).until(EC.staleness_of(next_page_element))
            else:
                time.sleep(0.5)
                initial = False
            
            company_links = get_comapnies_on_page()
            for links in company_links:
                f.writelines(links)
                f.writelines("\n")
            # Get element which contains buttons that changes pages
            next_page_element = driver.find_element(By.ID, "victor-pagination")
            next_page_list = next_page_element.find_elements(By.TAG_NAME, "a")

            start += 1
            if start == end + 1:
                break
            # Find element which is the next page and click it
            for numbers in next_page_list:
                if numbers.text == str(start):
                    actions.move_to_element_with_offset(numbers, 0, 0).click().perform()
                    break

       
if __name__ == "__main__":
    main()
