from extensions import db 
from werkzeug.security import generate_password_hash, check_password_hash


class Admin(db.Model):
    admin_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    admin_name = db.Column(db.String(125), nullable=False)
    admin_email = db.Column(db.String(125), unique=True, nullable=False)
    admin_pwd = db.Column(db.String(225), nullable=False)
    admin_role = db.Column(db.String(50), nullable=False, default='admin')


    def __init__(self, admin_name, admin_email, admin_pwd, admin_role='admin'):
        self.admin_name = admin_name
        self.admin_email = admin_email
        self.set_password(admin_pwd)
        self.admin_role = admin_role


    def set_password(self, password):
        self.admin_pwd = generate_password_hash(password)


    def __str__(self):
        return f'Admin: {self.admin_name} (Role: {self.admin_role})'



    def __str__(self):
        return (f'Admin name: {self.admin_name} - '
                f'Admin email: {self.admin_email}- '
                f'Admin role: {self.admin_role}')