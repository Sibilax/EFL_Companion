from marshmallow import Schema, fields, validates, ValidationError
import re

class AdminSchema(Schema):
    admin_id = fields.Int(dump_only=True)
    admin_name = fields.Str(required=True)
    admin_email = fields.Email(required=True)
    admin_pwd = fields.Str(load_only=True, required=True)
    admin_role = fields.Str(required=True)


    @validates('admin_pwd') 
    def validate_password(self, value):
        if len(value)  !=8:
            raise ValidationError('La contraseña debe tener 8 caracteres.')
        
        if not re.search(r'[A-Z]', value):
            raise ValidationError('La contraseña debe contener al menos una letra mayúscula.')

       
        if not re.search(r'[a-z]', value):
            raise ValidationError('La contraseña debe contener al menos una letra minúscula.')

        
        if not re.search(r'[0-9]', value):
            raise ValidationError('La contraseña debe contener al menos un número.')
   


    @validates('admin_email')
    def validate_email(self, value):
        email_format = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'  #expresión regular para buscar patrón de email

        if not re.match(email_format, value):
            raise ValidationError('Formato de email no válido.')
    
    class Meta:
        fields = ('admin_id', 'admin_name', 'admin_email', 'admin_pwd', 'admin_role')

admin_schema = AdminSchema()
admins_schema = AdminSchema(many=True)