from marshmallow import Schema, fields, validates, ValidationError
import re  # Sirve para validar el email y la contraseña con expresiones regulares


class UserSchema(Schema):
    user_id = fields.Int(dump_only=True) 
    user_name = fields.Str(required=True)
    user_email = fields.Email(required=True)
    user_pwd = fields.Str(load_only=True, required=True)
    user_status = fields.Str(default='inactive')

# El schema es la representación de los datos que se van a ingresar o validar, por eso se realizan las validaciones aquí(con el @decorador validates), para que si el dato no coincide no entre al bd.

    @validates('user_pwd') 
    def validate_password(self, value):
        if len(value) != 8:
            raise ValidationError('La contraseña debe tener 8 caracteres.')
        
        if not re.search(r'[A-Z]', value):
            raise ValidationError('La contraseña debe contener al menos una letra mayúscula.')

       
        if not re.search(r'[a-z]', value):
            raise ValidationError('La contraseña debe contener al menos una letra minúscula.')

        
        if not re.search(r'[0-9]', value):
            raise ValidationError('La contraseña debe contener al menos un número.')
   


    @validates('user_email')
    def validate_email(self, value):
        email_format = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'  #expresión regular para buscar patrón de email

        if not re.match(email_format, value):
            raise ValidationError('Formato de email no válido.')



    class Meta:
        fields = ('user_id', 'user_name', 'user_email', 'user_pwd')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

