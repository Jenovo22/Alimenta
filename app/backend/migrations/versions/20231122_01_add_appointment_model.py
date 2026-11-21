"""add appointment model

Revision ID: 20231122_01
Revises: 20231121_01
Create Date: 2026-11-21 12:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20231122_01'
down_revision = '20231121_01'
branch_labels = None
depends_on = None


def upgrade():
    """Create the appointments table with unique constraint to prevent double booking."""
    op.create_table(
        'appointments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('window_id', sa.Integer(), nullable=False),
        sa.Column('donor_id', sa.Integer(), nullable=False),
        sa.Column('transportador_id', sa.Integer(), nullable=True),
        sa.Column('status', sa.VARCHAR(length=20), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['donor_id'], ['usuarios.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['transportador_id'], ['usuarios.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['window_id'], ['ventanas_disponibilidad.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    
    # Create unique constraint to prevent double booking
    # In PostgreSQL: UNIQUE (window_id, donor_id)
    op.create_unique_constraint('uq_appointment_window_donor', 'appointments', ['window_id', 'donor_id'])
    
    # Create indexes for performance
    op.create_index('idx_appointments_window_id', 'appointments', ['window_id'])
    op.create_index('idx_appointments_donor_id', 'appointments', ['donor_id'])
    op.create_index('idx_appointments_status', 'appointments', ['status'])


def downgrade():
    """Drop the appointments table and its constraints."""
    op.drop_index('idx_appointments_status', table_name='appointments')
    op.drop_index('idx_appointments_donor_id', table_name='appointments')
    op.drop_index('idx_appointments_window_id', table_name='appointments')
    op.drop_constraint('uq_appointment_window_donor', 'appointments', type_='unique')
    op.drop_table('appointments')