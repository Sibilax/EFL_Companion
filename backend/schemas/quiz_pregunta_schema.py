from marshmallow import Schema, fields

class QuizPreguntaSchema(Schema):
    quiz_pregunta_id = fields.Int(dump_only=True)
    quiz_pregunta_nivel = fields.Str(required=True)
    quiz_pregunta_contenido = fields.Str(required=True)
    
    class Meta:
        fields = ('quiz_pregunta_id', 'quiz_pregunta_nivel', 'quiz_pregunta_contenido')

quiz_pregunta_schema = QuizPreguntaSchema()
quiz_preguntas_schema = QuizPreguntaSchema(many=True)