import { Component, OnInit } from '@angular/core';
import { DeployService } from './services/deploy.service';
import {ConfirmationService, PrimeIcons} from 'primeng/api';
import { transition } from '@angular/animations';
import { WalletService } from './services/wallet.service';
                                       
                                             // Connect wallet to AutoCon
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'AutoCon';                                    // By default no wallet is connected 

  wallet:string = "No wallet connected";
  walletConnected:boolean = false;
  launchedApp: boolean = false;
  chain: any = "aurora";
  chains = [ {name: "aurora"} ]

  constructor(private deployerService: DeployService, private confirmService: ConfirmationService, private walletService: WalletService){
    deployerService.wakeupCompileServer();
  }
                                               
  ngOnInit(){
    this.walletService.walletAddressChanged.subscribe(value => {
      this.wallet = value;
      console.log("wallet value: ", this.wallet)
    });
  }

  requestConnection() {                 // Requeste's connection with AutoCon wallet.
    this.confirmService.confirm({
      key: "connectionRequest",
      header: "Connect wallet",
      message: "Before proceeding you need to connect your wallet. Open your wallet extension and sign in. Once you've signed in click 'CONNECT'",
      acceptLabel: "CONNECT",
      acceptIcon: PrimeIcons.LINK,
      accept: async () => {
        let connectionResponse = this.walletService.connectWallet(this.chain.name);
        console.log("" == connectionResponse);
        if (connectionResponse == ""){
          this.confirmService.confirm({
            key: "invalidConnection",
            header: "Could not connect to wallet!",
            message: "AutoCon could not connect to an active wallet, you not be able to deploy a smart contract. Please ensure that you have correctly selected your intended chain, installed and logged into Metamask and then retry.",
            rejectVisible: false,
            acceptLabel: "Retry",
            acceptIcon: PrimeIcons.REPLAY,
            accept: () => {
              this.launchedApp = false;
            },
          })
        }
      },
      closeOnEscape: false,
      rejectVisible: false,
    })
  }

  launchApp(){
    console.log(this.chain.name)
    this.launchedApp = true;
    this.deployerService.connectedChain = this.chain.name;
    this.requestConnection()
  }
  
}
