from extensions import db 

class Blog(db.Model):
    blog_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    blog_title = db.Column(db.String(255), nullable=False)
    blog_content = db.Column(db.Text, nullable=False)
    blog_img = db.Column(db.LargeBinary)

    def __init__(self, blog_title, blog_content, blog_img=None):
        self.blog_title = blog_title
        self.blog_content = blog_content
        self.blog_img = blog_img


    def __str__(self):
        return (f'Blog: {self.blog_title}, '
                f'title: {self.blog_content} ')