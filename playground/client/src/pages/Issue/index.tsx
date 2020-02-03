import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {FC} from 'react-forward-props'
import {useId} from '@reach/auto-id'
import {codeBlock} from 'common-tags'

import {Shell} from '../../components/Shell'
import {Message, MessageSkin, MessageHeader, MessageBody} from '../../components/Message'
import {Delete} from '../../components/Delete'
import {sitemap} from '../../sitemap'
import {Button, ButtonSkin} from '../../components/Button'
import {Card, CardHeader, CardHeaderTitle, CardContent, CardFooter, CardFooterItem} from '../../components/Card'
import {api} from '../../api'
import {JsonEditor} from '../../components/JsonEditor'

import './index.scss'

type AtomicVCBuilderProps = {
  type: string
  data: {} | null
  onTypeChange: (type: string) => void
  onDataChange: (data: {} | null) => void
}

const AtomicVCBuilder: FC<'div', AtomicVCBuilderProps> = props => {
  const id = useId(props.id)

  return (
    <div>
      <div className="field">
        <label htmlFor={`${id}-type`} className="label">
          Type
        </label>
        <div className="control">
          <input
            required
            value={props.type}
            onChange={e => props.onTypeChange(e.target.value.trim())}
            id={`${id}-type`}
            className="input"
            type="text"
            placeholder="Type"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-data`} className="label">
          Data
        </label>
        <div className="control">
          <JsonEditor id={`${id}-data`} value={props.data} onChange={props.onDataChange} />
        </div>
      </div>
    </div>
  )
}

type IssueProps = {}

export const Issue: React.FC<IssueProps> = props => {
  const [newCredId, setNewCredId] = useState<string>()
  const [type, setType] = useState('')
  const [data, setData] = useState<{} | null>({})

  const isDisabled = type.trim() === '' || data === null

  return (
    <Shell titleSuffix="Issue">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Issue Credential</h1>
      <p className="subtitle has-text-centered">Create claim nodes for a credential.</p>
      {newCredId && (
        <Message skin={MessageSkin.success}>
          <MessageHeader>
            <p>Request Successfully Created</p>
            <Delete onClick={() => setNewCredId(undefined)} aria-label="clear message" />
          </MessageHeader>
          <MessageBody>
            To claim this credential navigate to <Link to={sitemap.claim(newCredId)}>{sitemap.claim(newCredId)}</Link>.
          </MessageBody>
        </Message>
      )}
      <div className="columns">
        <div className="column is-half">
          <Card>
            <CardHeader>
              <CardHeaderTitle className="issue__claim-nodes__title">Claim Nodes</CardHeaderTitle>
            </CardHeader>
            <CardContent>
              <div className="issue__claim-nodes__content">
                <AtomicVCBuilder type={type} data={data} onTypeChange={setType} onDataChange={setData} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="column is-half">
          <Card>
            <CardHeader>
              <CardHeaderTitle>Atomic Verifiable Credential</CardHeaderTitle>
            </CardHeader>
            <CardContent>
              <div className="issue__vc__content">
                <pre>
                  <code>
                    {codeBlock`
                    const atomicVC = buildAtomicVCV1({
                      type: ['${type}']
                      data: ${JSON.stringify(data)},
                      subject: 'did:ethr:0x...',
                      issuanceDate: '...',
                      expirationDate: '...',
                      privateKey: Buffer.from('...', 'hex'),
                    })
                    `}
                  </code>
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <CardFooterItem>
                <Button
                  isFullwidth
                  skin={ButtonSkin.info}
                  onClick={async () => {
                    const {id} = await api.cred.create({type, data: data!})
                    setNewCredId(id)
                    setType('')
                    setData({})
                  }}
                  isDisabled={isDisabled}
                >
                  Issue VC
                </Button>
              </CardFooterItem>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Shell>
  )
}
