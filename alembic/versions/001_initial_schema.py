"""Initial schema creation

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create companies table
    op.create_table(
        'companies',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('industry', sa.String(100), nullable=True),
        sa.Column('location', sa.String(100), nullable=True),
        sa.Column('employee_count', sa.Integer(), nullable=True),
        sa.Column('website', sa.String(255), nullable=True),
        sa.Column('apollo_id', sa.String(100), nullable=True),
        sa.Column('strategic_sector', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('recent_growth', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('sicoes_participation', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('adequate_size', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('decision_maker_found', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('purchase_signal', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('score', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('temperature', sa.String(20), nullable=False, server_default='cold'),
        sa.Column('score_justification', sa.String(1000), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('last_enriched_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('apollo_id', name='uq_companies_apollo_id'),
        sa.Index('idx_companies_name', 'name'),
    )

    # Create contacts table
    op.create_table(
        'contacts',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('company_id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('title', sa.String(255), nullable=True),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('linkedin_url', sa.String(255), nullable=True),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('apollo_id', sa.String(100), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.Index('idx_contacts_company_id', 'company_id'),
        sa.Index('idx_contacts_email', 'email'),
    )

    # Create signals table
    op.create_table(
        'signals',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('company_id', sa.String(36), nullable=False),
        sa.Column('signal_type', sa.String(100), nullable=False),
        sa.Column('source', sa.String(100), nullable=False),
        sa.Column('description', sa.String(1000), nullable=False),
        sa.Column('relevance', sa.Float(), nullable=False, server_default='0.5'),
        sa.Column('detected_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.Index('idx_signals_company_id', 'company_id'),
    )

    # Create tenders table
    op.create_table(
        'tenders',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('process_number', sa.String(100), nullable=False),
        sa.Column('entity_name', sa.String(255), nullable=False),
        sa.Column('description', sa.String(1000), nullable=True),
        sa.Column('amount', sa.Float(), nullable=True),
        sa.Column('status', sa.String(50), nullable=False, server_default='active'),
        sa.Column('source', sa.String(50), nullable=False, server_default='sicoes'),
        sa.Column('published_date', sa.DateTime(), nullable=True),
        sa.Column('closing_date', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('process_number', name='uq_tenders_process_number'),
        sa.Index('idx_tenders_process_number', 'process_number'),
        sa.Index('idx_tenders_entity_name', 'entity_name'),
    )


def downgrade() -> None:
    op.drop_table('tenders')
    op.drop_table('signals')
    op.drop_table('contacts')
    op.drop_table('companies')
