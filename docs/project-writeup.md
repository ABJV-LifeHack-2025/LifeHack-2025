# Ethical Brand Guide

## Chosen Problem Statement: Which challenge did you choose to tackle?
We chose to tackle Theme 3 (Consumption and the Environment). Specifically, we targeted Problem Statement 2, which involved building an ethical brand awareness tool that aggregates ESG (Environmental, Social and Governance) data of different brands, and presents them in a user-friendly way.

## Solution Overview: What does your project do and how does it solve the problem?
At the core of our project is our interactive dashboard site. It displays the different brands in our database with not only their ESG score, but also different data points of interest to consumers, such as the industry that company operates in, their country of origin, and common products they sell. Users can click on each brand to learn more about how they fare in the 3 domains (Environment, Social and Governance).

In particular, our site has a feature called "In the News", where we aggregate any news articles that mention the company in the capacity of ESG. We then display this news on the site for users to view.

Users also have the ability to create an account, log in, and choose different brands to save as their "favourite". Not only can this create a personalised view of brands each individual user interacts with, but personalised statistics are displayed based on the user's favourite brands, indicating how well the user aligns with the 3 ESG domains. For each brand in the user's "favourite" list, email notifications will be sent to the user in 2 scenarios: When our "In the News" feature tracks a new article about the brand, and when our ESG scores for the brand is updated.

The other component of our solution is a browser extension. It links to our database of aggregated ESG data and integrates this valuable information with e-commerce sites such as Amazon. When a user views a product from a particular brand, they are able to view our ESG scores for that brand as well.

## Technical Implementation: Tools, frameworks, libraries, APIs, and hardware used.
For the core web app, we have used Next.js as the frontend and Supabase as a BaaS (Backend-as-a-Service). We had also used the GNews.io API to make requests for our company-based news reports.

For the browser extension, simple web technologies were used (HTML, CSS, JavaScript).

## Development Process (optional): How your team built the solution, your workflow, any key iterations or pivots.

## Challenges & Learning Points(optional): What obstacles did you face and what did you learn?

Our biggest challenge revolved around collating the data sets for ESG information and news. This proved to be a multifaceted obstacle due to the unique nature of ESG data and the immense volume of information available.

Obstacles Faced: Collating Data Sets

1.  Data Fragmentation and Diversity: ESG data isn't centralized like financial data. It's scattered across company sustainability reports, news articles, regulatory filings, NGO publications, and various third-party rating agencies, all often in different formats (PDFs, web pages, structured data). Extracting, cleaning, and unifying this disparate information was a significant hurdle.
2.  Lack of Standardization in ESG Metrics: Unlike clear financial metrics, ESG reporting lacks universal standardization. Different companies might report similar environmental impacts using varied methodologies or metrics, making direct comparisons and aggregation challenging. This required us to develop custom categorization.
3.  Ensuring Data Quality and Reliability: Relying on news APIs and various sources meant we had to contend with varying levels of detail, potential biases, and the risk of "greenwashing" in self-reported company data. Filtering for accuracy and relevance, especially for sentiment-based ESG categories (like our 'environmental', 'social', 'governance' classification), demanded careful design of our processing logic.

## Future Improvements(optional): How would you improve or scale the project?
