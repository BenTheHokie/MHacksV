#!/usr/bin/env python
from flask import Flask, render_template, render_template_string, redirect, request, jsonify
from itertools import groupby
from jinja2.environment import Environment
import os, json

app = Flask(__name__)
app.jinja_env.variable_start_string = '{|'
app.jinja_env.variable_end_string = '|}'

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    #app.run(debug=True, port = 5000, host='0.0.0.0')
    app.run()
