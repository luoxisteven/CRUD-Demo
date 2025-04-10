from django.db import models

# Create your models here.
class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=[('to_do', 'To Do'), ('in_progress', 'In Progress'), ('done', 'Done')],
        default='to_do'
    )

    def __str__(self):
        return self.title