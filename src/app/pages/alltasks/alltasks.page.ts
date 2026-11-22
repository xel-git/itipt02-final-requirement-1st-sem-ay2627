import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardContent, IonLabel, IonSearchbar, IonTabBar, IonChip} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { trashOutline, createOutline, addOutline, gridOutline, listOutline, 
  eyeOutline, readerOutline, saveOutline, calendarOutline, bookOutline,
  albumsOutline, checkmarkOutline, checkmarkDoneOutline, fileTrayOutline, 
  addCircleOutline, documentTextOutline, flagOutline, timeOutline, hourglassOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-alltasks',
  templateUrl: './alltasks.page.html',
  standalone: true,
  imports: [IonChip, IonTabBar, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardContent, IonLabel, IonSearchbar,FormsModule, CommonModule, RouterLink
  ]
})
export class AlltasksPage implements OnInit {
  filter: string = 'all';
  searchText: string = '';
  loading = false;

  constructor(public taskService: TaskService, private router: Router) {
    addIcons({ 
      trashOutline, createOutline, addOutline, gridOutline, listOutline, 
      eyeOutline, readerOutline, saveOutline, calendarOutline, bookOutline,
      albumsOutline, checkmarkOutline, checkmarkDoneOutline, fileTrayOutline, 
      addCircleOutline, documentTextOutline, flagOutline ,timeOutline, hourglassOutline
    });
  }

  ngOnInit() { 
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
  
   get filteredTasks() {
    let tasks = this.taskService.tasks();
    if (this.filter !== 'all') {
      tasks = tasks.filter(t => t.status === this.filter);
    }
    if (this.searchText) {
      const q = this.searchText.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
      );
    }
    return tasks;
  }
  
  edit(task: any) {
  this.router.navigate(['/tasks'], { queryParams: { id: task.id } });
}

  deleteTask(id: number | string) {
    if (confirm('DELETE this task?')) {
      this.taskService.deleteTask(id).subscribe();
    }
  }

  markDone(task: any) {
    const payload = {
      title: task.title,
      subject: task.subject,
      deadline: task.deadline,
      status: 'done'
    };
    this.taskService.updateTask(task.id ,payload).subscribe({next: () => console.log('done'), error: (e) => console.log('error')
    });
  }

  getColor(s: string) {
    if (s === 'done') return 'success';
    if (s === 'doing') return 'primary';
    return 'warning'; 
  }
}