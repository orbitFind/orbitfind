"""Added location, hosts, and tags to Event

Revision ID: be36c534f5f0
Revises: 54dae7a5e89f
Create Date: 2024-08-17 00:59:55.112225

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'be36c534f5f0'
down_revision = '54dae7a5e89f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('location', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('tags', sa.JSON(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.drop_column('tags')
        batch_op.drop_column('location')

    # ### end Alembic commands ###
