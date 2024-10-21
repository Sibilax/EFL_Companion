from extensions import db 

class Video(db.Model):
    video_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    video_title = db.Column(db.String(255), nullable=False)
    video_url = db.Column(db.Text, nullable=False)
    video_content = db.Column(db.Text, nullable=False)

    def __init__(self, video_title, video_url, video_content):
        self.video_title = video_title
        self.video_url = video_url
        self.video_content = video_content

    def __str__(self):
        return (f'Video: {self.video_title} - '
                f'url: {self.video_url}')