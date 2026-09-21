'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { useIsInView } from '@/hooks/use-is-in-view';

const SplittingText = function ({
    ref,
    text,
    segments,
    type = 'chars',
    initial = { x: 150, opacity: 0 },
    animate = { x: 0, opacity: 1 },
    transition = { duration: 0.7, ease: 'easeOut' },
    stagger,
    staggerFrom = 'start',
    delay = 0,
    inView = false,
    inViewMargin = '0px',
    inViewOnce = true,
    disableAnimation = false,
    ...props
}) {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                delayChildren: delay / 1000,
                staggerChildren: stagger ?? (type === 'chars' ? 0.05 : type === 'words' ? 0.2 : 0.3),
            },
        },
    };

    const itemVariants = {
        hidden: disableAnimation ? animate : initial,
        visible: {
            ...animate,
            transition: disableAnimation ? { duration: 0 } : transition,
        },
    };

    const { ref: localRef, isInView } = useIsInView(ref, {
        inView,
        inViewOnce,
        inViewMargin,
    });

    if (Array.isArray(text)) {
        return (
            <motion.span
                ref={localRef}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={containerVariants}
                {...props}
            >
                {text.map(function (line, i) {
                    return (
                        <React.Fragment key={`line-${i}`}>
                            <motion.span
                                variants={itemVariants}
                                style={{ display: 'inline-block' }}
                            >
                                {line}
                            </motion.span>
                            {i < text.length - 1 ? <br /> : null}
                        </React.Fragment>
                    );
                })}
            </motion.span>
        );
    }

    if (type === 'words') {
        const tokens = text.match(/\S+\s*/g) || [];
        return (
            <motion.span
                ref={localRef}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={containerVariants}
                {...props}
            >
                {tokens.map(function (token, i) {
                    return (
                        <React.Fragment key={i}>
                            <motion.span
                                variants={itemVariants}
                                style={{ display: 'inline-block', whiteSpace: 'normal' }}
                            >
                                {token.trim()}
                            </motion.span>
                            {/\s$/.test(token) ? ' ' : null}
                        </React.Fragment>
                    );
                })}
            </motion.span>
        );
    }

    const perChar = stagger ?? 0.05;
    const baseDelaySec = (delay ?? 0) / 1000;
    const fromCenter = staggerFrom === 'center';
    const sourceSegments = segments ?? [{ text: text }];

    const words = [];
    sourceSegments.forEach(function (seg, si) {
        seg.text.split(/(\s+)/).forEach(function (part, pi) {
            if (part === '') return;
            if (/^\s+$/.test(part)) {
                words.push({ key: `space-${si}-${pi}`, space: part });
            } else {
                words.push({ key: `word-${si}-${pi}`, className: seg.className, chars: Array.from(part) });
            }
        });
    });

    let totalChars = 0;
    words.forEach(function (w) {
        if (w.chars) totalChars += w.chars.length;
    });
    const center = (totalChars - 1) / 2;
    let runningIndex = 0;

    return (
        <motion.span
            ref={localRef}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
                hidden: {},
                visible: { transition: {} },
            }}
            {...props}
        >
            {words.map(function (w) {
                if (w.space !== undefined) {
                    return <span key={w.key}>{w.space}</span>;
                }
                const wordStart = runningIndex;
                runningIndex += w.chars.length;

                return (
                    <motion.span
                        key={w.key}
                        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                        variants={{}}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                    >
                        {w.chars.map(function (ch, ci) {
                            const order = fromCenter ? Math.abs(wordStart + ci - center) : (wordStart + ci);
                            const charVariants = {
                                hidden: itemVariants.hidden,
                                visible: {
                                    ...itemVariants.visible,
                                    transition: {
                                        ...(itemVariants.visible.transition || {}),
                                        delay: baseDelaySec + order * perChar,
                                    },
                                },
                            };
                            return (
                                <motion.span
                                    key={`ch-${w.key}-${ci}`}
                                    className={w.className}
                                    variants={charVariants}
                                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                                >
                                    {ch}
                                </motion.span>
                            );
                        })}
                    </motion.span>
                );
            })}
        </motion.span>
    );
};

export { SplittingText };