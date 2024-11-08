"""update

Revision ID: 49e65ad73e84
Revises: 344d573b7ce6
Create Date: 2024-10-08 03:34:49.225341

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '49e65ad73e84'
down_revision = '344d573b7ce6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('blog', schema=None) as batch_op:
        batch_op.alter_column('blog_img',
               existing_type=mysql.LONGBLOB(),
               type_=sa.LargeBinary(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('blog', schema=None) as batch_op:
        batch_op.alter_column('blog_img',
               existing_type=sa.LargeBinary(),
               type_=mysql.LONGBLOB(),
               existing_nullable=True)

    # ### end Alembic commands ###
