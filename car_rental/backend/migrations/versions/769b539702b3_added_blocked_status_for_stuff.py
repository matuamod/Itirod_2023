"""added_blocked_status_for_stuff

Revision ID: 769b539702b3
Revises: cfcea6294ae9
Create Date: 2024-02-11 11:31:35.826842

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '769b539702b3'
down_revision = 'cfcea6294ae9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('stuff', sa.Column('is_blocked', sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('stuff', 'is_blocked')
    # ### end Alembic commands ###
