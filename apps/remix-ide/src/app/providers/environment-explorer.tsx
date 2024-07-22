import React from 'react' // eslint-disable-line
import { ViewPlugin } from '@remixproject/engine-web'
import { PluginViewWrapper } from '@remix-ui/helper'
import { RemixUIGridView } from '@remix-ui/remix-ui-grid-view'
import { RemixUIGridSection } from '@remix-ui/remix-ui-grid-section'
import { RemixUIGridCell } from '@remix-ui/remix-ui-grid-cell'
import './style/environment-explorer.css'
import type { Provider } from '../../blockchain/blockchain'

import * as packageJson from '../../../../../package.json'

const _paq = (window._paq = window._paq || [])

const profile = {
  name: 'environmentExplorer',
  displayName: 'Environment Explorer',
  icon: 'assets/img/EnvironmentExplorerLogo.webp',
  description: 'Customize the Environments list in Deploy & Run',
  location: 'mainPanel',
  documentation: 'https://remix-ide.readthedocs.io/en/latest/run.html',
  version: packageJson.version,
  maintainedBy: 'Remix',
  permission: true,
  events: [],
  methods: []
}

type ProvidersSection = `Injected` | 'Remix VMs' | 'Externals'

export class EnvironmentExplorer extends ViewPlugin {
  providers: { [key in ProvidersSection]: Provider[] }
  providersFlat: { [key: string]: Provider }
  pinnedProviders: string[]
  dispatch: React.Dispatch<any> = () => {}

  constructor() {
    super(profile)
    this.providersFlat = {}
    this.providers = {
      'Injected': [],
      'Remix VMs': [],
      'Externals': []
    }
  }

  async onActivation(): Promise<void> {
    this.providersFlat = await this.call('blockchain', 'getAllProviders')
    this.pinnedProviders = await this.call('blockchain', 'getPinnedProviders')
    this.renderComponent()
  }

  addProvider (provider: Provider) {
    if (provider.isInjected) {
      this.providers['Injected'].push(provider)
    } else if (provider.isVM) {
      this.providers['Remix VMs'].push(provider)
    } else {
      this.providers['Externals'].push(provider)
    }
  }

  setDispatch(dispatch: React.Dispatch<any>): void {
    this.dispatch = dispatch
    this.renderComponent()
  }
  render() {
    return (
      <div className="bg-dark" id="environmentExplorer">
        <PluginViewWrapper plugin={this} />
      </div>
    )
  }

  renderComponent() {
    this.dispatch({
      ...this
    })
  }

  updateComponent(state: any) {
    this.providers = {
      'Injected': [],
      'Remix VMs': [],
      'Externals': []
    }
    for (const [key, provider] of Object.entries(this.providersFlat)) {
      this.addProvider(provider)
    }
    return (
      <RemixUIGridView
        plugin={this}
        styleList={""}
        logo={profile.icon}
        enableFilter={true}
        showUntagged={true}
        showPin={true}
        title={profile.description}
        description="Select the providers and chains to include them in the ENVIRONMENT select box of the Deploy & Run Transactions plugin."
      >
        <RemixUIGridSection
          plugin={this}
          title='Deploy using a Browser Extension.'
          hScrollable={false}
        >
          {this.providers['Injected'].map(provider => {
            return <RemixUIGridCell
              plugin={this}
              title={provider.displayName}
              logos={provider.logos}
              classList='EECellStyle'
              payload={provider.description}
              pinned={this.pinnedProviders.includes(provider.name)}
              pinStateCallback={async (pinned: boolean) => {
                if (pinned) {
                  this.emit('providerPinned', provider.name, provider)
                  this.call('notification', 'toast', `"${provider.displayName}" has been added to the Environment list of the Deploy & Run Transactions plugin.`)
                  return true
                }
                const providerName = await this.call('blockchain', 'getProvider')
                if (providerName !== provider.name) {
                  this.emit('providerUnpinned', provider.name, provider)
                  this.call('notification', 'toast', `"${provider.displayName}" has been removed from the Environment list of the Deploy & Run Transactions plugin.`)
                  return true
                } else {
                  this.call('notification', 'toast', 'Cannot unpin the current selected provider')
                  return false
                }
              }}
            >
              <div>{provider.description}</div>
            </RemixUIGridCell>
          })}
        </RemixUIGridSection>
        <RemixUIGridSection
          plugin={this}
          title='Deploy to an In-browser Virtual Machine.'
          hScrollable={false}
        >{this.providers['Remix VMs'].map(provider => {
            return <RemixUIGridCell
              plugin={this}
              title={provider.displayName}
              logos={provider.logos}
              classList='EECellStyle'
              payload={provider.description}
              pinned={this.pinnedProviders.includes(provider.name)}
              pinStateCallback={async (pinned: boolean) => {
                if (pinned) {
                  this.emit('providerPinned', provider.name, provider)
                  this.call('notification', 'toast', `"${provider.displayName}" has been added to the Environment list of the Deploy & Run Transactions plugin.`)
                  return true
                }
                const providerName = await this.call('blockchain', 'getProvider')
                if (providerName !== provider.name) {
                  this.emit('providerUnpinned', provider.name, provider)
                  this.call('notification', 'toast', `"${provider.displayName}" has been removed from the Environment list of the Deploy & Run Transactions plugin.`)
                  return true
                } else {
                  this.call('notification', 'toast', 'Cannot unpin the current selected provider')
                  return false
                }
              }}
            >
              <div>{provider.description}</div>
            </RemixUIGridCell>
          })}</RemixUIGridSection>
        <RemixUIGridSection
          plugin={this}
          title='Deploy to an external Provider.'
          hScrollable={false}
        >{this.providers['Externals'].map(provider => {
            return <RemixUIGridCell
              plugin={this}
              title={provider.displayName}
              logos={provider.logos}
              payload={provider.description}
              classList='EECellStyle'
              pinned={this.pinnedProviders.includes(provider.name)}
              pinStateCallback={async (pinned: boolean) => {
                if (pinned) {
                  this.emit('providerPinned', provider.name, provider)
                  this.call('notification', 'toast', `"${provider.displayName}" has been added to the Environment list of the Deploy & Run Transactions plugin.`)
                  return true
                }
                const providerName = await this.call('blockchain', 'getProvider')
                if (providerName !== provider.name) {
                  this.emit('providerUnpinned', provider.name, provider)
                  this.call('notification', 'toast', `"${provider.displayName}" has been removed from the Environment list of the Deploy & Run Transactions plugin.`)
                  return true
                } else {
                  this.call('notification', 'toast', 'Cannot unpin the current selected provider')
                  return false
                }
              }}
            >
              <div>{provider.description}</div>
            </RemixUIGridCell>
          })}</RemixUIGridSection>
      </RemixUIGridView>
    )
  }
}
