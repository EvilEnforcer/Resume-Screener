from flask import Blueprint, request, jsonify
from app.resume_analyzer import analyze_resume
from app.models import JobRequest
import traceback

resume_routes = Blueprint('resume_routes', __name__)


@resume_routes.route('/analyze-resume', methods=['POST'])
def analyze_resume_route():
    try:
        data = request.get_json()

        if not data or not all(k in data for k in ("resume", "job_title", "job_description")):
            return jsonify({"error": "Missing required fields."}), 400

        job_req = JobRequest(
            resume_b64=data["resume"],
            job_title=data["job_title"],
            job_description=data["job_description"]
        )

        result = analyze_resume(
            job_req.resume_b64,
            job_req.job_title,
            job_req.job_description
        )

        if "error" in result:
            return jsonify(result), 500

        return jsonify(result)


    except Exception as e:

        traceback.print_exc()

        return jsonify({"error": f"Unexpected server error: {str(e)}"}), 500
