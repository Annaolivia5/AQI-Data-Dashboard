import numpy as np
import pandas as pd
import datetime as dt
from config import pw
import sqlalchemy
from sqlalchemy import extract
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.schema import MetaData
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from flask import Flask, render_template, json, jsonify

def make_list(query):

    l = []

    for i in query:
        l.append(i[0])

    return l


#################################################
# Database Setup
#################################################
engine = create_engine(f"postgresql://postgres:{pw}@localhost:5432/AQI_US_2000_2016")
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Create session (link) from Python to the DB
session = Session(bind=engine)

# Save reference to the table
AQI_ref = Base.classes.aqi
AQI_map = Base.classes.map



#################################################
# Flask Setup
#################################################
app = Flask(__name__)



#################################################
# Flask Routes
#################################################
@app.route("/")
def index():
    with open('templates/index.html') as f:
        return f.read()


@app.route("/jsondata")
def jsondata():

    d2 = {}
    d2['aqiData'] = []
    

    year = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016']
    d2['year'] = year

    for y in year:
        d = {}
        results = session.query(func.avg(AQI_ref.no2_aqi), func.avg(AQI_ref.o3_aqi), func.avg(AQI_ref.so2_aqi), func.avg(AQI_ref.co_aqi))\
            .filter(extract('year', AQI_ref.date) == y)\
            .filter(AQI_ref.county == 'San Diego')\
            .filter(AQI_ref.state =='California').all()
        d['year'] = y
        d['aqi'] = list(results[0])
        d2['aqiData'] .append(d)
    
    rs = json.dumps(d2)
    print('_______________________________')
    print(rs)
    print('_______________________________')
    return rs

@app.route("/map")
def map():

    d2 = {}
    aqi_query_list = []
    d = {}

    years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016']
    d2['year'] = years


    for y in years:
    
        results = session.query(AQI_map.state, AQI_map.no2_aqi, AQI_map.o3_aqi, AQI_map.so2_aqi, AQI_map.co_aqi)\
            .filter(extract('year', AQI_map.date) == y).all()

        d[y] = [list(x) for x in results]

    d2['aqiData'] = d
    rs = json.dumps(d2)
    
    return rs

    


if __name__ == "__main__":
    app.run(debug=True)
