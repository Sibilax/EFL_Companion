import os
from dotenv import load_dotenv

load_dotenv()

class Config:
 
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

    if not JWT_SECRET_KEY:
      raise ValueError("JWT_SECRET_KEY no está definido en el archivo .env")



