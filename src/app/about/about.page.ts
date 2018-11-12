import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Message } from '../message.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  form: FormGroup
  submitted: boolean = false

  constructor(private toastCtrl: ToastController) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
    })
  }

  prepareMessage(): Message {
    const formData = Object.assign({}, this.form.value)
    const message = new Message
    message.set(formData)
    return message
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000
    })
    toast.present()
  }

  async onSubmit() {

    try {

      const message = this.prepareMessage()
  
      if (this.form.invalid) {
        this.presentToast('Please fill the required fields')
        return
      }
  
      this.submitted = true
  
      await message.save()

      this.form.reset()

      this.submitted = false
      this.presentToast('Message sent')
      
    } catch (error) {
      this.submitted = false
      this.presentToast('Network error')
    }


  }

}
