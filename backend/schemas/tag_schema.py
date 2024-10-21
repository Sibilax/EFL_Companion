from marshmallow import Schema, fields

class TagSchema(Schema):
    tag_id = fields.Int(dump_only=True)
    tag_name = fields.Str(required=True)
    tag_curso_id = fields.Int(allow_none=True)
    tag_quiz_pregunta_id = fields.Int(allow_none=True)
    tag_blog_id = fields.Int(allow_none=True)
    tag_video_id = fields.Int(allow_none=True)


    class Meta:
        fields = ('tag_id', 'tag_name', 'tag_curso_id', 'tag_quiz_pregunta_id', 'tag_blog_id', 'tag_video_id')

tag_schema = TagSchema()
tags_schema = TagSchema(many=True)