from flask import Flask
from app.routes import resume_routes

app = Flask(__name__)
app.register_blueprint(resume_routes)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

#Testing CI/CD Pipeline
