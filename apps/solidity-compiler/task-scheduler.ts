typescript
interface Task {
  id: number;
  name: string;
  priority: number;
  execute: () => Promise<void>;
}

class TaskScheduler {
  private tasks: Task[] = [];
  private isRunning: boolean = false;
  private currentId: number = 0;

  addTask(name: string, priority: number, action: () => Promise<void>): number {
    const task: Task = {
      id: ++this.currentId,
      name,
      priority,
      execute: action
    };
    
    this.tasks.push(task);
    this.tasks.sort((a, b) => b.priority - a.priority);
    
    console.log(`Task added: ${name} (ID: ${task.id}, Priority: ${priority})`);
    
    if (!this.isRunning) {
      this.processTasks();
    }
    
    return task.id;
  }

  private async processTasks(): Promise<void> {
    if (this.tasks.length === 0) {
      this.isRunning = false;
      return;
    }
    
    this.isRunning = true;
    
    while (this.tasks.length > 0) {
      const task = this.tasks.shift()!;
      
      try {
        console.log(`Executing task: ${task.name} (ID: ${task.id})`);
        await task.execute();
        console.log(`Task completed: ${task.name} (ID: ${task.id})`);
      } catch (error) {
        console.error(`Task failed: ${task.name} (ID: ${task.id})`, error);
      }
    }
    
    this.isRunning = false;
    console.log('All tasks processed');
  }

  getPendingTaskCount(): number {
    return this.tasks.length;
  }

  clearTasks(): void {
    this.tasks = [];
    console.log('All pending tasks cleared');
  }
}

// Example usage
async function exampleUsage() {
  const scheduler = new TaskScheduler();
  
  // Simulate some async tasks
  const task1Id = scheduler.addTask('Data backup', 1, async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Backup completed');
  });
  
  const task2Id = scheduler.addTask('User notification', 3, async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Notifications sent');
  });
  
  const task3Id = scheduler.addTask('System cleanup', 2, async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Cleanup finished');
  });
  
  console.log(`Pending tasks: ${scheduler.getPendingTaskCount()}`);
  
  // Wait for tasks to complete
  await new Promise(resolve => setTimeout(resolve, 3000));
}

// Uncomment to run example
// exampleUsage();
```