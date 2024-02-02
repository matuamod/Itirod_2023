"""added_blocked_user_table

Revision ID: 6c7efb3ba38a
Revises: 774374f1ee34
Create Date: 2024-02-02 12:15:25.083544

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6c7efb3ba38a'
down_revision = '774374f1ee34'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('blocked_user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('telephone', sa.String(length=13), nullable=False),
    sa.Column('license', sa.String(length=10), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('blocked_user')
    # ### end Alembic commands ###