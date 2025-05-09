from django.db import models

class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=[
            ('To Do', 'To Do'),
            ('In Progress', 'In Progress'),
            ('Done', 'Done')
        ],
        default='To Do'
    )

    def __str__(self):
        return self.title

    class Meta:
         # Explicitly set the table name to 'task'. 
         # If not set, Django will use 'appname_task' as the default table name.
         # "task_task" in this case
        db_table = 'tasks'