import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
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
  title = '';
  subject = '';
  deadline = '';
  status: TaskStatus = 'pending';
  isEditMode = false;
  editId: number | string | null = null;
  loading = false;

  constructor(
    public taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController 
  ) {
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
       this.editId = null;
       this.isEditMode = false;
       this.title = '';
       this.subject = '';
       this.deadline = '';
       this.status = 'pending';
      }
    });
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

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  async showAlert(message: string = 'Task Created Successfully!') {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  saveTask() {
  if (!this.title.trim() || !this.subject.trim()) {
    this.showToast('Title and Subject required', 'danger');
    return;
  }

  const payload = { title: this.title, subject: this.subject, deadline: this.deadline, status: this.status };
  this.loading = true;

  if (this.editId) {
    this.taskService.updateTask(this.editId, payload).subscribe({
      next: async () => {
        this.clearForm();
        this.loading = false;
        await this.showToast('Task Updated Successfully!');
        this.router.navigate(['/alltasks']);
      },
      error: () => this.loading = false
    });
  } else {
    this.taskService.createTask(payload).subscribe({
      next: async () => {
        this.clearForm();
        this.loading = false;
        await this.showToast('Task Created Successfully!');
      },
      error: () => this.loading = false
    });
  }
}
clearForm() {
  const savedEditId = this.editId;
  const savedIsEdit = this.isEditMode;

  this.title = '';
  this.subject = '';
  this.deadline = '';
  this.status = 'pending';

  this.editId = savedEditId;
  this.isEditMode = savedIsEdit;
}
}