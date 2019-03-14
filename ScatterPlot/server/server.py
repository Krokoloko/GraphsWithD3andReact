from flask import Flask, render_template

app = Flask(__name__, static_folder="../static/bundle", template_folder="../static")

def get_json_file(file_path):
    json = open(file_path, 'r')
    json_string = json.read()
    return json_string

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/worker_data')
def worker_data():
    return get_json_file("../Data/workers.json")

app.run()
