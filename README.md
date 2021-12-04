# Project3

Our AQI Data Visualization Dashboard
visualizaes data for pollutants (N02, SO2,  O3, CO) in the United State and San Diego, California. 


Data from kaggle that was previously scraped from the U.S. EPA and then assembled into a CSV was used.

Source: https://www.kaggle.com/sogun3/uspollution

The original Kaggle CSV was modified with Pandas to contain only data we needed for this project. 

The dashboard visualizes how CO AQI affected each state in the U.S. for the year 2015.

Second, the dashboard shows how all 4 pollutants affect San Diego, CA, across all years in the data (2000-2016).

Notes: A file called config.py with a variable "pw" must be created, to import  your PostgreSQL password. Run the SQL_python.ipynb to create postgreSQL Databse prior to running the flask app (app.py).

Final Dashboard:
![Dashboard](../images/DASH.png "dashboard images")
