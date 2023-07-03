import * as vscode from 'vscode';

export class AccountManagerExtension {
  private context: vscode.ExtensionContext;
  private accounts: { id: string }[];
  private treeDataProvider: AccountsTreeDataProvider;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.accounts = [];

    // Create a TreeDataProvider to manage the accounts in the sidebar
    this.treeDataProvider = new AccountsTreeDataProvider(this.accounts);
    vscode.window.createTreeView("multi-account-container", {
      treeDataProvider: this.treeDataProvider,
    });

    // Register a command that allows users to add new accounts
    context.subscriptions.push(
      vscode.commands.registerCommand("accountManager.addAccount", () => {
        this.openSignUpPage();
      })
    );
  }

  // Open a webpage where the user can sign up for a new account
  openSignUpPage() {
    const url = vscode.Uri.parse("https://github.com/join");
    vscode.env.openExternal(url);
  }

  // Sign in to an account
  signIn(id: string) {
    const account = { id };
    this.accounts.push(account);

    // Update the TreeDataProvider to show the newly signed in account
    this.treeDataProvider.refresh();
  }

  // Sign out of an account
  signOut(id: string) {
    const index = this.accounts.findIndex((account) => account.id === id);
    if (index !== -1) {
      this.accounts.splice(index, 1);

      // Update the TreeDataProvider to show the accounts that are still signed in
      this.treeDataProvider.refresh();
    }
  }
}

// The main function that is executed when the extension is loaded
export function activate(context: vscode.ExtensionContext) {
  new AccountManagerExtension(context);
  console.log('Congratulations, your extension "multi-account-container" is now active!');

}

// A custom TreeDataProvider that manages the accounts in the sidebar
class AccountsTreeDataProvider implements vscode.TreeDataProvider<Account> {
  private _onDidChangeTreeData: vscode.EventEmitter<Account | undefined> =
    new vscode.EventEmitter<Account | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Account | undefined> =
    this._onDidChangeTreeData.event;

  constructor(private accounts: Account[]) {}

refresh(): void {
  const account = new Account("");

  this._onDidChangeTreeData.fire(account);
}

  getTreeItem(element: Account): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Account): Thenable<Account[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.accounts.map((account) => new Account(account.id)));
    }
  }
}


// A custom TreeItem that represents an account in the sidebar
class Account extends vscode.TreeItem {
  constructor(public readonly id: string) {
    super(id, vscode.TreeItemCollapsibleState.None);
  }
}


// This method is called when your extension is deactivated
export function deactivate() {
	  console.log('So sad you are leaving so soon!');

}