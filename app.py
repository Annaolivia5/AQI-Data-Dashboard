import numpy as np
import pandas as pd
import datetime as dt
from config import pw
import sqlalchemy
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
  
    states = make_list(session.query(AQI_ref.state))
    d = {}
    d["states"] = states
    co_aqi = make_list(session.query(AQI_ref.co_aqi))
    d["coAQI"] = co_aqi

    # results = session.query(AQI_ref).all()
    rs = json.dumps(d)
    return rs


if __name__ == "__main__":
    app.run(debug=True)
