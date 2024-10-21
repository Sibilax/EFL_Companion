"""Add cascade delete between QuizPregunta and QuizRespuesta

Revision ID: 4ea469d0d482
Revises: 85ce452c297c
Create Date: 2024-09-21 13:15:01.116653

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4ea469d0d482'
down_revision = '85ce452c297c'
branch_labels = None
depends_on = None


def upgrade():
    # Eliminar la clave foránea existente en la tabla quiz_respuesta
    op.drop_constraint('quiz_respuesta_ibfk_1', 'quiz_respuesta', type_='foreignkey')

    # Crear una nueva clave foránea con ON DELETE CASCADE
    op.create_foreign_key(
        'quiz_respuesta_ibfk_1',  # Nombre de la clave foránea
        'quiz_respuesta',         # Tabla hija
        'quiz_pregunta',          # Tabla padre
        ['quiz_respuesta_pregunta_id'],  # Columna en la tabla hija
        ['quiz_pregunta_id'],     # Columna en la tabla padre
        ondelete='CASCADE'        # Configuración para eliminación en cascada
    )

def downgrade():
    # Revertir el cambio eliminando la clave foránea con ON DELETE CASCADE
    op.drop_constraint('quiz_respuesta_ibfk_1', 'quiz_respuesta', type_='foreignkey')

    # Volver a crear la clave foránea sin ON DELETE CASCADE
    op.create_foreign_key(
        'quiz_respuesta_ibfk_1',
        'quiz_respuesta', 
        'quiz_pregunta', 
        ['quiz_respuesta_pregunta_id'], 
        ['quiz_pregunta_id']
    )
