"""Add score_justification and last_enriched_at to companies

Revision ID: add_score_justification
Revises: 5b057dd6f004
Create Date: 2026-05-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'add_score_justification'
down_revision: Union[str, Sequence[str], None] = '5b057dd6f004'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    cols = {row[0] for row in conn.execute(sa.text(
        "SELECT column_name FROM information_schema.columns WHERE table_name='companies'"
    ))}
    if 'score_justification' not in cols:
        op.add_column('companies', sa.Column('score_justification', sa.Text(), nullable=True))
    if 'last_enriched_at' not in cols:
        op.add_column('companies', sa.Column('last_enriched_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('companies', 'last_enriched_at')
    op.drop_column('companies', 'score_justification')
