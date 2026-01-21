import { Component, OnInit } from '@angular/core';

import { HttpService } from '../../services/http.service';
 
@Component({

  selector: 'app-chat',

  templateUrl: './chatbot.component.html',

  styleUrls: ['./chatbot.component.scss']

})

export class ChatComponent implements OnInit {

  userMessage = '';

  messages: { sender: string, text: string, timestamp: Date }[] = [];

  isLoading = false;
 
  constructor(private http: HttpService) {}
 
  ngOnInit(): void {

    // Welcome message

    this.messages.push({

      sender: 'bot',

      text: 'Hello! I\'m your Medical Equipment Assistant. How can I help you today?',

      timestamp: new Date()

    });

  }
 
  send() {

    if (!this.userMessage.trim() || this.isLoading) return;
 
    // Add user message

    this.messages.push({

      sender: 'user',

      text: this.userMessage,

      timestamp: new Date()

    });
 
    const currentMessage = this.userMessage;

    this.userMessage = '';

    this.isLoading = true;
 
    // Scroll to bottom

    setTimeout(() => this.scrollToBottom(), 100);
 
    // Send to backend

    this.http.sendMessage(currentMessage).subscribe({

      next: (res) => {

        this.messages.push({

          sender: 'bot',

          text: res.reply,

          timestamp: new Date()

        });

        this.isLoading = false;

        setTimeout(() => this.scrollToBottom(), 100);

      },

      error: (err) => {

        console.error('Chatbot error:', err);

        this.messages.push({

          sender: 'bot',

          text: 'Sorry, I encountered an error. Please try again later.',

          timestamp: new Date()

        });

        this.isLoading = false;

        setTimeout(() => this.scrollToBottom(), 100);

      }

    });

  }
 
  private scrollToBottom() {

    const chatMessages = document.querySelector('.chat-messages');

    if (chatMessages) {

      chatMessages.scrollTop = chatMessages.scrollHeight;

    }

  }
 
  clearChat() {

    this.messages = [{

      sender: 'bot',

      text: 'Chat cleared. How can I help you?',

      timestamp: new Date()

    }];

  }

}
 