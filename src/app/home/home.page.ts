import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../services/task';
import { IonTabBar,IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonLabel } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline, gridOutline, listOutline, readerOutline,personOutline, addOutline, timeOutline, hourglassOutline, trophyOutline, layersOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [IonTabBar,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonLabel, RouterLink]
})
export class HomePage implements OnInit {
  constructor(public taskService: TaskService) {
    addIcons({ checkmarkDoneOutline, gridOutline, listOutline, readerOutline, personOutline, addOutline, timeOutline, hourglassOutline, trophyOutline, layersOutline });
  }
  ngOnInit() { this.taskService.fetchTasks(); }
  ionViewWillEnter() { this.taskService.fetchTasks(); }
}
