"""sync

Revision ID: c78346dfc359
Revises: 33db766ba35f
Create Date: 2024-09-21 14:34:12.165539

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c78346dfc359'
down_revision = '33db766ba35f'
branch_labels = None
depends_on = None


def upgrade():
    # Eliminar la clave foránea existente
    with op.batch_alter_table('quiz_respuesta', schema=None) as batch_op:
        batch_op.drop_constraint('quiz_respuesta_ibfk_1', type_='foreignkey')

        # Crear la clave foránea con ON DELETE CASCADE
        batch_op.create_foreign_key('quiz_respuesta_ibfk_1', 'quiz_pregunta', ['quiz_respuesta_pregunta_id'], ['quiz_pregunta_id'], ondelete='CASCADE')

def downgrade():
    # Revertir la clave foránea a su estado original
    with op.batch_alter_table('quiz_respuesta', schema=None) as batch_op:
        batch_op.drop_constraint('quiz_respuesta_ibfk_1', type_='foreignkey')

        # Volver a crear la clave foránea sin ON DELETE CASCADE
        batch_op.create_foreign_key('quiz_respuesta_ibfk_1', 'quiz_pregunta', ['quiz_respuesta_pregunta_id'], ['quiz_pregunta_id'])

