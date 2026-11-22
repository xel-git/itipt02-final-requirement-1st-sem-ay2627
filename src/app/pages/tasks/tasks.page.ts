import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService, Task, TaskStatus } from '../../services/task';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonCard, IonCardContent, IonFooter, IonSegment, IonSegmentButton, IonLabel, IonChip, IonSpinner } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline, addOutline, gridOutline, listOutline, checkmarkDoneOutline, personOutline, saveOutline, calendarOutline, bookOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tasks', 
  templateUrl: './tasks.page.html',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonCard, IonCardContent, IonFooter, IonSegment, IonSegmentButton, IonLabel, IonChip, IonSpinner, FormsModule, CommonModule, RouterLink]
})
export class TasksPage implements OnInit {
  title = '';
  subject = '';
  deadline = '';
  status: TaskStatus = 'pending';
  isEditMode = false;
  editId: number | string | null = null;
  loading = false;

  constructor(public taskService: TaskService) {
    addIcons({ trashOutline, createOutline, addOutline, gridOutline, listOutline, checkmarkDoneOutline, personOutline, saveOutline, calendarOutline, bookOutline });
  }
  ngOnInit() { 
    this.load();
  }
  ionViewWillEnter() { 
    this.load(); 
  }
  load() { 
    this.loading = true; 
    this.taskService.getTasks().subscribe({ next: () => this.loading = false, error: () => this.loading = false });
  }

  saveTask() {
    if (!this.title.trim() || !this.subject.trim()) {
       alert('Title and Subject required'); 
       return;
 }
    const payload = { title: this.title, subject: this.subject, deadline: this.deadline, status: this.status };
    this.loading = true;
    if (this.isEditMode && this.editId) {
      this.taskService.updateTask(this.editId, payload).subscribe({ next: () => { this.reset(); this.loading = false; }, error: () => this.loading = false });
    } else {
      this.taskService.createTask(payload).subscribe({ next: () => { this.reset(); this.loading = false; }, error: () => this.loading = false });
    }
  }
  edit(task: Task) { this.title = task.title; this.subject = task.subject; this.deadline = task.deadline; this.status = task.status; this.isEditMode = true; this.editId = task.id; }
  reset() { this.title = ''; this.subject = ''; this.deadline = ''; this.status = 'pending'; this.isEditMode = false; this.editId = null; }
  deleteTask(id: number | string) {
    if (confirm('DELETE this task?')) {
      this.taskService.deleteTask(id).subscribe();
    }
  }
  getColor(s: string) { return s === 'done' ? 'success' : s === 'doing' ? 'warning' : 'medium'; }
}