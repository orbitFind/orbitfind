import sqlalchemy as sa
from sqlalchemy.dialects import mysql
from alembic import op

# revision identifiers, used by Alembic.
revision = '54dae7a5e89f'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Check if the 'status' column already exists
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [column['name'] for column in inspector.get_columns('events')]

    if 'status' not in columns:
        with op.batch_alter_table('events', schema=None) as batch_op:
            batch_op.add_column(sa.Column('status', sa.Enum('before', 'ongoing', 'completed', name='status_enum'), nullable=False))
            batch_op.drop_index('event_id')
            batch_op.drop_column('completed')

def downgrade():
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('completed', mysql.TINYINT(display_width=1), autoincrement=False, nullable=False))
        batch_op.create_index('event_id', ['event_id'], unique=True)
        batch_op.drop_column('status')