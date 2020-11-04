import { Component, ViewChild, HostListener } from '@angular/core';
import { Platform, IonSlides, IonContent, ToastController } from '@ionic/angular';
import { ThemeService } from '../theme.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { Post } from '../post.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

interface ToolbarButton {
  id: string,
  title: string,
  icon: string,
  color: string,
  selected: boolean,
}

interface SlidePost {
  id: string,
  posts: Post[]
}

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  @ViewChild(IonSlides) slides: IonSlides
  @ViewChild(IonContent, { static: true }) content: IonContent

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {

    if (!this.slides) return;

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.slides.slideNext()
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.slides.slidePrev()
    }
  }

  public buttons: ToolbarButton[] = []
  public selectedButton: ToolbarButton
  public slidesPost: SlidePost[] = []
  public posts: Post[] = []
  public fakeArray: number[] = []
  public isNetworkError: boolean = false
  public isLoading: boolean

  public slideOpts = {
    autoHeight: false,
    autoplay: false,
    touchStartPreventDefault: false,
  }

  public webSocialShare: { show: boolean, share: any, onClosed: any } = {
    show: false,
    share: {
      config: [{
        facebook: {
          socialShareUrl: '',
          socialShareText: ''
        },
      }, {
        twitter: {
          socialShareUrl: '',
          socialShareText: ''
        }
      }, {
        whatsapp: {
          socialShareUrl: '',
          socialShareText: ''
        }
      }]
    },
    onClosed: () => {
      this.webSocialShare.show = false;
    }
  };

  constructor(private platform: Platform,
    private inAppBrowser: InAppBrowser,
    private browserTab: BrowserTab,
    private postService: Post,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    private themeService: ThemeService) { }

  ngOnInit() {

    this.createButtons()
    this.createSlides()
    this.createFakeArray()

    const button = this.setActiveButton(0)
    this.themeService.setPrimaryColor(button.color)

    this.loadPosts()
  }

  sleep(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loadPosts(refresher = null) {

    try {

      this.isNetworkError = false

      if (refresher === null) {
        this.isLoading = true
      }

      this.posts = await this.postService.loadAll()

      for (const slide of this.slidesPost) {
        slide.posts = this.posts.filter(post => slide.id === post.source)
      }

      const index = this.buttons.indexOf(this.getActiveButton())
      if (this.slides) this.slides.slideTo(index, 0)

      this.isNetworkError = false

      this.onRefreshComplete(refresher)

    } catch (error) {
      this.isNetworkError = true
      this.onRefreshComplete(refresher)
    }

  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000
    })
    toast.present()
  }

  onCopyButtonTouched(post: Post) {

    const textarea = document.createElement('textarea')
    textarea.style.position = 'fixed'
    textarea.style.left = '0'
    textarea.style.top = '0'
    textarea.style.opacity = '0'
    textarea.value = post.url
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    this.presentToast('Link copied to clipboard')
  }

  async onShare(post: Post) {

    this.webSocialShare.share.config.forEach((item: any) => {
      if (item.whatsapp) {
        item.whatsapp.socialShareUrl = post.url;
        item.whatsapp.socialShareText = post.title + ' (via swipeone.app) ';
      } else if (item.facebook) {
        item.facebook.socialShareUrl = post.url;
        item.facebook.socialShareText = post.title + ' (via swipeone.app) ';
      } else if (item.twitter) {
        item.twitter.socialShareUrl = post.url;
        item.twitter.socialShareText = post.title + ' (via swipeone.app) ';
      }
    });

    if (this.platform.is('hybrid')) {

      try {
        await this.socialSharing.share(post.title, null, null, post.url);
      } catch (err) {
        console.warn(err)
      }

    } else {
      this.webSocialShare.show = true;
    }

  }

  onChangeToggle(ev: CustomEvent) {
    this.themeService.enableDarkMode(ev.detail.checked)
  }

  async onSlideDidChange() {

    this.content.scrollToTop()

    const index = await this.slides.getActiveIndex()
    const button = this.setActiveButton(index)
    this.themeService.setPrimaryColor(button.color)
  }

  getActiveButton() {
    return this.buttons.find(button => button.selected === true)
  }

  setActiveButton(index: number) {
    this.buttons.forEach(button => button.selected = false)
    this.selectedButton = this.buttons[index]
    this.selectedButton.selected = true
    return this.selectedButton
  }

  isSlideActive(slide: SlidePost) {
    return this.selectedButton.id === slide.id
  }

  onRefreshComplete(event) {
    if (event) event.target.complete()
    this.isLoading = false
  }

  createFakeArray() {
    this.fakeArray = Array.from(Array(15).keys())
  }

  createButtons() {

    this.buttons.push({
      id: 'producthunt',
      title: 'Product Hunt',
      icon: './assets/product-hunt.svg',
      color: '#da552f',
      selected: false,
    })

    this.buttons.push({
      id: 'reddit',
      title: 'Reddit',
      icon: 'logo-reddit',
      color: '#0470DC',
      selected: true,
    })
    this.buttons.push({
      id: 'github',
      title: 'Github',
      icon: 'logo-github',
      color: '#444',
      selected: false,
    })
    this.buttons.push({
      id: 'hackernews',
      title: 'Hacker News',
      icon: 'logo-hackernews',
      color: '#ff6600',
      selected: false,
    })
  }

  createSlides() {

    this.slidesPost.push({
      id: 'producthunt',
      posts: []
    })
    this.slidesPost.push({
      id: 'reddit',
      posts: []
    })
    this.slidesPost.push({
      id: 'github',
      posts: []
    })
    this.slidesPost.push({
      id: 'hackernews',
      posts: []
    })
  }

  onButtonTouched(button: ToolbarButton) {
    const index = this.buttons.indexOf(button)
    this.setActiveButton(index)

    this.themeService.setPrimaryColor(button.color)

    if (this.slides) this.slides.slideTo(index)
  }

  async openUrl(url: string) {

    try {

      if (this.platform.is('cordova')) {

        const isAvailable = await this.browserTab.isAvailable()

        if (isAvailable) {
          this.browserTab.openUrl(url)
        } else {
          this.inAppBrowser.create(url, '_system')
        }

      } else {
        this.inAppBrowser.create(url, '_blank')
      }

    } catch (error) {
      console.warn(error)
    }

  }


}
