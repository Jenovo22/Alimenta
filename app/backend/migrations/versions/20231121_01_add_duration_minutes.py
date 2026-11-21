'''add duration_minutes column to ventanas_disponibilidad'''

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20231121_01'
 down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('ventanas_disponibilidad', sa.Column('duration_minutes', sa.Integer(), nullable=False, server_default='60'))

def downgrade():
    op.drop_column('ventanas_disponibilidad', 'duration_minutes')
