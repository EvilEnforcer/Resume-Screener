class JobRequest:
    def __init__(self, resume_b64: str, job_title: str, job_description: str):
        self.resume_b64 = resume_b64
        self.job_title = job_title
        self.job_description = job_description
