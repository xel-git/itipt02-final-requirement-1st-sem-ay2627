import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type TaskStatus = 'pending' | 'doing' | 'done';

export interface Task {
  id: number | string;
  title: string;
  subject: string;
  deadline: string;
  status: TaskStatus;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  
  editingTask: Task | null = null;
  private apiUrl = 'http://127.0.0.1:3000/task'; 

  private tasksSignal = signal<Task[]>([]);
  tasks = this.tasksSignal.asReadonly();
  
  pendingCount = computed(() => this.tasks().filter(t => t.status?.toLowerCase() === 'pending').length);
  doingCount = computed(() => this.tasks().filter(t => t.status?.toLowerCase() === 'doing').length);
  doneCount = computed(() => this.tasks().filter(t => t.status?.toLowerCase() === 'done').length);
  totalCount = computed(() => this.tasks().length);

  constructor(private http: HttpClient) {}

  fetchTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (data) => this.tasksSignal.set(data),
      error: (err) => console.log('API Error, using local data', err)
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(data => this.tasksSignal.set(data))
    );
  }

  createTask(task: Omit<Task, 'id'>) {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(() => this.fetchTasks())
    );
  }
   updateTask(id: any, task: any){
  return this.http.put(`${this.apiUrl}/${id}`, task).pipe(
    tap(()=>this.fetchTasks())
  );
}
  deleteTask(id: any){
  return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    tap(()=>this.fetchTasks())
  );
}
}