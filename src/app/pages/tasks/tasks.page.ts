import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService, TaskStatus } from '../../services/task';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonCard, IonCardContent, IonLabel, IonTabBar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { documentTextOutline, flagOutline, trashOutline, createOutline, addOutline, gridOutline, listOutline, readerOutline, saveOutline, calendarOutline, bookOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  standalone: true,
  imports: [IonTabBar, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonCard, IonCardContent, IonLabel, FormsModule, CommonModule, RouterLink]
})
export class TasksPage implements OnInit {
  title = ''; subject = ''; 
  deadline = ''; 
  status: TaskStatus = 'pending';
  isEditMode = false; 
  editId: number | string | null = null; 
  loading = false;

  constructor(public taskService: TaskService, private router: Router, private route: ActivatedRoute) {
    addIcons({ documentTextOutline, flagOutline, trashOutline, createOutline, addOutline, gridOutline, listOutline, readerOutline, saveOutline, calendarOutline, bookOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.editId = id;
        const tasks = this.taskService.tasks();
        let found = tasks.find(t => String(t.id) === String(id));
        if (found) {
          this.title = found.title;
          this.subject = found.subject;
          this.deadline = found.deadline;
          this.status = (found.status?.toLowerCase() as any) || 'pending';
        } else {
          this.taskService.getTasks().subscribe({
            next: (data: any) => {
              const f = data.find((t: any) => String(t.id) === String(id));
              if (f) {
                this.title = f.title;
                this.subject = f.subject;
                this.deadline = f.deadline;
                this.status = (f.status?.toLowerCase() as any) || 'pending';
              }
            }
          });
        }
      } else {
        this.reset();
      }
    });
    this.load();
  }

  ionViewWillEnter() {
    this.load();
  }

  load() {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  saveTask() {
    if (!this.title.trim() || !this.subject.trim()) {
       alert('Title and Subject required'); return; 
      }
    const payload = { title: this.title, subject: this.subject, deadline: this.deadline, status: this.status };
    this.loading = true;
    if (this.isEditMode && this.editId) {
      this.taskService.updateTask(this.editId, payload).subscribe({
        next: () => { this.reset(); this.loading = false; this.router.navigate(['/alltasks']); },
        error: () => this.loading = false
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: () => { this.reset(); this.loading = false; },
        error: () => this.loading = false
      });
    }
  }

  reset() {
    this.title = ''; this.subject = ''; this.deadline = '';
    this.status = 'pending'; this.isEditMode = false; this.editId = null;
  }
}