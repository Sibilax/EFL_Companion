from marshmallow import Schema, fields

class VideoSchema(Schema):
    video_id = fields.Int(dump_only=True)
    video_title = fields.Str(required=True)
    video_url = fields.Str(required=True)
    video_content = fields.Str(required=True)

    class Meta:
        fields = ('video_id', 'video_title', 'video_url', 'video_content')

video_schema = VideoSchema()
videos_schema = VideoSchema(many=True)