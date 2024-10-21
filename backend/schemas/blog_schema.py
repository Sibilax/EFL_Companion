from marshmallow import Schema, fields

class BlogSchema(Schema):
    blog_id = fields.Int(dump_only=True)
    blog_title = fields.Str(required=True)
    blog_content = fields.Str(required=True)
    blog_img = fields.Str(allow_none=True)
    

    class Meta:
        fields = ('blog_id', 'blog_title', 'blog_content', 'blog_img')

blog_schema = BlogSchema()
blogs_schema = BlogSchema(many=True)