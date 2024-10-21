from marshmallow import Schema, fields

class QuizRespuestaSchema(Schema):
    quiz_respuesta_id = fields.Int(dump_only=True)
    quiz_respuesta_opcion = fields.Str(required=True)
    quiz_respuesta_contenido = fields.Str(required=True)
    quiz_respuesta_correcta = fields.Boolean(required=True)
    quiz_respuesta_pregunta_id = fields.Int(required=True, allow_none=False)
    
    class Meta:
        fields = ('quiz_respuesta_id', 'quiz_respuesta_opcion', 'quiz_respuesta_contenido', 'quiz_respuesta_correcta', 'quiz_respuesta_pregunta_id')

quiz_respuesta_schema = QuizRespuestaSchema()
quiz_respuestas_schema = QuizRespuestaSchema(many=True)