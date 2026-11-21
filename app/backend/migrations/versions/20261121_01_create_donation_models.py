"""Create donation models for Alimenta platform.

Revision ID: 20261121_01
Revises: 
Create Date: 2026-11-21 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20261121_01'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Create all new tables for the donations database."""
    # Create users table (if not exists)
    op.create_table(
        'usuarios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='donante'),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )

    # Create communities table
    op.create_table(
        'comunidades',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('code', sa.String(length=50), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code'),
    )

    # Create product categories table
    op.create_table(
        'categorias_productos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=True),
        sa.Column('parent_id', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['parent_id'], ['categorias_productos.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create products table
    op.create_table(
        'productos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=True),
        sa.Column('unit', sa.String(length=50), nullable=True),
        sa.Column('is_perishable', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['categorias_productos.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create edil-community links table
    op.create_table(
        'ediles_comunidades',
        sa.Column('edil_id', sa.Integer(), nullable=False),
        sa.Column('community_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['edil_id'], ['usuarios.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['community_id'], ['comunidades.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('edil_id', 'community_id'),
    )

    # Create availability windows table
    op.create_table(
        'ventanas_disponibilidad',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('owner_id', sa.Integer(), nullable=False),
        sa.Column('owner_type', sa.String(length=10), nullable=False),
        sa.Column('community_id', sa.Integer(), nullable=True),
        sa.Column('start_datetime', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('end_datetime', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('duration_minutes', sa.Integer(), nullable=False, server_default='60'),
        sa.Column('capacity', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='ACTIVE'),
        sa.Column('slot_label', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['community_id'], ['comunidades.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['owner_id'], ['usuarios.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    # Create index for owner lookup
    op.create_index('idx_ventanas_owner_id', 'ventanas_disponibilidad', ['owner_id'])

    # Create volunteer events table
    op.create_table(
        'jornadas_voluntariado',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('account_id', sa.Integer(), nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('volunteer_name', sa.String(length=255), nullable=False),
        sa.Column('venue', sa.String(length=500), nullable=False),
        sa.Column('date', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('start_time', sa.String(length=8), nullable=False),
        sa.Column('end_time', sa.String(length=8), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='Pendiente de revisión'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['account_id'], ['usuarios.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create needs table (solicitudes) first - referenced by donations
    op.create_table(
        'solicitudes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('edil_id', sa.Integer(), nullable=False),
        sa.Column('community_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=True),
        sa.Column('is_satisfied', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='Publicada'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['community_id'], ['comunidades.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['edil_id'], ['usuarios.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['product_id'], ['productos.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create donations table (unified model with appointment/scheduling fields)
    op.create_table(
        'donaciones',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('donor_id', sa.Integer(), nullable=False),
        sa.Column('edil_id', sa.Integer(), nullable=True),
        sa.Column('need_id', sa.Integer(), nullable=True),
        sa.Column('window_id', sa.Integer(), nullable=True),
        sa.Column('transportador_id', sa.Integer(), nullable=True),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('modality', sa.String(length=20), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='Ofrecida'),
        sa.Column('appointment_status', sa.String(length=50), nullable=False, server_default='Pendiente de aceptación'),
        sa.Column('transport_status', sa.String(length=30), nullable=False, server_default='Pendiente'),
        sa.Column('receipt_status', sa.String(length=30), nullable=False, server_default='Pendiente'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['donor_id'], ['usuarios.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['edil_id'], ['usuarios.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['need_id'], ['solicitudes.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['product_id'], ['productos.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['transportador_id'], ['usuarios.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['window_id'], ['ventanas_disponibilidad.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create inventory table
    op.create_table(
        'inventario_banco',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('received_quantity', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('available_quantity', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('reserved_quantity', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('dispatched_quantity', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('location', sa.String(length=100), nullable=True),
        sa.Column('last_received_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['product_id'], ['productos.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('product_id'),
    )

    # Create inventory movements table
    op.create_table(
        'movimientos_inventario',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('inventory_id', sa.Integer(), nullable=False),
        sa.Column('movement_type', sa.String(length=20), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('reference_donation_id', sa.Integer(), nullable=True),
        sa.Column('notes', sa.String(length=500), nullable=True),
        sa.Column('created_by_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['created_by_id'], ['usuarios.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['inventory_id'], ['inventario_banco.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create organizations table
    op.create_table(
        'organizaciones_aliadas',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('logo_url', sa.String(length=500), nullable=True),
        sa.Column('website_url', sa.String(length=500), nullable=True),
        sa.Column('rank_position', sa.Integer(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create feature flags table
    op.create_table(
        'feature_flags',
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('name'),
    )


def downgrade():
    """Drop all tables in reverse order."""
    op.drop_table('feature_flags')
    op.drop_table('organizaciones_aliadas')
    op.drop_table('movimientos_inventario')
    op.drop_table('inventario_banco')
    op.drop_table('donaciones')
    op.drop_table('solicitudes')
    op.drop_table('jornadas_voluntariado')
    op.drop_table('ventanas_disponibilidad')
    op.drop_table('ediles_comunidades')
    op.drop_table('productos')
    op.drop_table('categorias_productos')
    op.drop_table('comunidades')
    op.drop_table('usuarios')