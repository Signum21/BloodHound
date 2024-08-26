import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import CollapsibleSection from './Components/CollapsibleSection';
import NodeCypherLink from './Components/NodeCypherLink';
import NodeCypherLinkR from './Components/NodeCypherLinkR';
import MappedNodeProps from './Components/MappedNodeProps';
import ExtraNodeProps from './Components/ExtraNodeProps';
import { Table } from 'react-bootstrap';
import styles from './NodeData.module.css';
import { AppContext } from '../../../AppContext';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import NodeCypherLinkComplex from './Components/NodeCypherLinkComplex';

const TemplateNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectid, setObjectid] = useState(null);
    const [label, setLabel] = useState(null);
    const [domain, setDomain] = useState(null);
    const [nodeProps, setNodeProps] = useState({});
	const [blocksInheritance, setBlocksInheritance] = useState(false);
    const context = useContext(AppContext);

    useEffect(() => {
        emitter.on('nodeClicked', nodeClickEvent);

        return () => {
            emitter.removeListener('nodeClicked', nodeClickEvent);
        };
    }, []);

    const nodeClickEvent = (type, id, blocksinheritance, domain) => {
        if (type === 'CertificateTemplate') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
			setBlocksInheritance(blocksinheritance);
            let session = driver.session();
            session
                .run(`MATCH (n:CertificateTemplate {objectid: $objectid}) RETURN n AS node`, {
                    objectid: id,
                })
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name);
                    session.close();
                });
        } else {
            setObjectid(null);
            setVisible(false);
        }
    };

    const displayMap = {
        objectid: 'Object ID',
    };

    return objectid === null ? (
        <div></div>
    ) : (
        <div
            className={clsx(
                !visible && 'displaynone',
                context.darkMode ? styles.dark : styles.light
            )}
        >
            <div className={clsx(styles.dl)}>
                <h5>{label || objectid}</h5>

                <CollapsibleSection header='OVERVIEW'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLinkR
                                    property='Certificate Template ADCS Structure'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (t:CertificateTemplate {objectid: $objectid}) OPTIONAL MATCH r=(o)-[:Enroll]->(t) OPTIONAL MATCH r2=(t)-[:EnabledBy]->(a:CA) OPTIONAL MATCH r3=(c:Computer)-[:Contains]->(a) RETURN t, r, r2, r3'
                                    }
                                    start={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <MappedNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <ExtraNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <CollapsibleSection header='INBOUND CONTROL RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Explicit Object Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (n)-[r:AllExtendedRights|GenericAll|GenericWrite|WriteDacl|WriteOwner|WriteProperty|Owns]->(g:CertificateTemplate {objectid: $objectid})'
									}
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Unrolled Object Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (n)-[r:MemberOf*1..]->(g1:Group)-[r1:AllExtendedRights|GenericAll|GenericWrite|WriteDacl|WriteOwner|WriteProperty|Owns]->(g2:CertificateTemplate {objectid:  $objectid}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.name = g2.name) AND NOT n.name = g2.name'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Transitive Object Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (n) WHERE NOT n.objectid= $objectid WITH n MATCH p = shortestPath((n)-[r:AllExtendedRights|GenericAll|GenericWrite|WriteDacl|WriteOwner|WriteProperty|Owns*1..]->(g:CertificateTemplate {objectid: $objectid}))'
                                    }
                                    end={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>
				
                <hr></hr>

                <CollapsibleSection header='ENROLLMENT RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Enrollment Rights'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[r:AutoEnroll|Enroll|GenericAll]->(u1:CertificateTemplate {objectid: $objectid})'
									}
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated Enrollment Rights'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[r:MemberOf*1..]->(g:Group)-[r1:AutoEnroll|Enroll|GenericAll]->(u:CertificateTemplate {objectid: $objectid}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.objectid = u.objectid) AND NOT n.objectid = u.objectid'
                                    }
                                    end={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>
				
				<hr></hr>
            </div>
        </div>
    );
};

TemplateNodeData.propTypes = {};
export default TemplateNodeData;
