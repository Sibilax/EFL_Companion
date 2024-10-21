from marshmallow import Schema, fields

class CursoSchema(Schema):
    curso_id = fields.Int(dump_only=True)
    curso_name = fields.Str(required=True)
    curso_description = fields.Str(required=True)
    curso_level = fields.Str(required=True)
    curso_img = fields.Str(allow_none=True)

    class Meta:
        fields = ('curso_id', 'curso_name', 'curso_description', 'curso_level', 'curso_img')

curso_schema = CursoSchema()
cursos_schema = CursoSchema(many=True)