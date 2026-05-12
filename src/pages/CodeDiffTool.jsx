import React, { useState, useMemo } from 'react';
import * as Diff from 'diff';
import Editor from '../components/Editor';
import BackButton from '../components/BackButton';

export default function CodeDiffTool() {
    const [originalCode, setOriginalCode] = useState('');
    const [modifiedCode, setModifiedCode] = useState('');

    const [diffMode, setDiffMode] = useState('split');
    const [diffGranularity, setDiffGranularity] = useState('line');
    const [language, setLanguage] = useState('plain-text');

    // Compute Diff
    const { diffs, additions, deletions } = useMemo(() => {
        if (!originalCode && !modifiedCode) return { diffs: [], additions: 0, deletions: 0 };

        let diffResults = [];
        try {
            if (diffGranularity === 'word') {
                diffResults = Diff.diffWords(originalCode, modifiedCode);
            } else if (diffGranularity === 'json') {
                const obj1 = originalCode.trim() ? JSON.parse(originalCode) : {};
                const obj2 = modifiedCode.trim() ? JSON.parse(modifiedCode) : {};
                diffResults = Diff.diffJson(obj1, obj2);
            } else {
                diffResults = Diff.diffLines(originalCode, modifiedCode);
            }
        } catch (e) {
            // Fallback to line diff if JSON parse fails
            diffResults = Diff.diffLines(originalCode, modifiedCode);
        }

        let adds = 0;
        let dels = 0;
        diffResults.forEach(part => {
            if (part.added) adds += part.count || 1;
            if (part.removed) dels += part.count || 1;
        });

        return { diffs: diffResults, additions: adds, deletions: dels };
    }, [originalCode, modifiedCode, diffGranularity]);

    const handleSwap = () => {
        const temp = originalCode;
        setOriginalCode(modifiedCode);
        setModifiedCode(temp);
    };

    const handleClear = () => {
        setOriginalCode('');
        setModifiedCode('');
    };

    // Render Split View
    const renderSplitView = () => {
        if (diffGranularity === 'word') return renderUnifiedView();

        const rows = [];
        let leftLineNum = 1;
        let rightLineNum = 1;

        for (let i = 0; i < diffs.length; i++) {
            const part = diffs[i];
            const lines = part.value.replace(/\n$/, '').split('\n');

            if (!part.added && !part.removed) {
                lines.forEach(line => {
                    rows.push({
                        leftLine: leftLineNum++, leftContent: line, leftType: 'normal',
                        rightLine: rightLineNum++, rightContent: line, rightType: 'normal'
                    });
                });
            } else if (part.removed) {
                let nextPart = diffs[i + 1];
                if (nextPart && nextPart.added) {
                    const addedLines = nextPart.value.replace(/\n$/, '').split('\n');
                    const maxLines = Math.max(lines.length, addedLines.length);
                    for (let j = 0; j < maxLines; j++) {
                        rows.push({
                            leftLine: j < lines.length ? leftLineNum++ : null,
                            leftContent: j < lines.length ? lines[j] : '',
                            leftType: j < lines.length ? 'removed' : 'empty',
                            rightLine: j < addedLines.length ? rightLineNum++ : null,
                            rightContent: j < addedLines.length ? addedLines[j] : '',
                            rightType: j < addedLines.length ? 'added' : 'empty'
                        });
                    }
                    i++; // skip next
                } else {
                    lines.forEach(line => {
                        rows.push({
                            leftLine: leftLineNum++, leftContent: line, leftType: 'removed',
                            rightLine: null, rightContent: '', rightType: 'empty'
                        });
                    });
                }
            } else if (part.added) {
                lines.forEach(line => {
                    rows.push({
                        leftLine: null, leftContent: '', leftType: 'empty',
                        rightLine: rightLineNum++, rightContent: line, rightType: 'added'
                    });
                });
            }
        }

        if (rows.length === 0) {
            return <div className="p-4 text-center text-gray-500">No differences to show.</div>;
        }

        return (
            <div className="font-mono text-sm border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-x-auto">
                <table className="w-full border-collapse">
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="w-12 text-right pr-2 text-gray-400 select-none bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">{row.leftLine}</td>
                                <td className={`w-1/2 px-4 whitespace-pre-wrap ${row.leftType === 'removed' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' : ''}`}>
                                    {row.leftContent}
                                </td>
                                <td className="w-12 text-right pr-2 text-gray-400 select-none bg-gray-50 dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700">{row.rightLine}</td>
                                <td className={`w-1/2 px-4 whitespace-pre-wrap ${row.rightType === 'added' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : ''}`}>
                                    {row.rightContent}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderUnifiedView = () => {
        if (diffs.length === 0) {
            return <div className="p-4 text-center text-gray-500">No differences to show.</div>;
        }

        if (diffGranularity === 'word') {
            return (
                <div className="font-mono text-sm p-4 whitespace-pre-wrap border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
                    {diffs.map((part, idx) => {
                        const colorClass = part.added ? 'bg-green-200 dark:bg-green-800/50 text-green-900 dark:text-green-100' :
                            part.removed ? 'bg-red-200 dark:bg-red-800/50 text-red-900 dark:text-red-100 line-through' : '';
                        return <span key={idx} className={colorClass}>{part.value}</span>
                    })}
                </div>
            )
        }

        let leftLineNum = 1;
        let rightLineNum = 1;

        return (
            <div className="font-mono text-sm border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-x-auto">
                <table className="w-full border-collapse">
                    <tbody>
                        {diffs.map((part, idx) => {
                            const lines = part.value.replace(/\n$/, '').split('\n');
                            return lines.map((line, lineIdx) => {
                                let lNum = '';
                                let rNum = '';
                                let marker = ' ';
                                let bgClass = '';

                                if (part.added) {
                                    rNum = rightLineNum++;
                                    marker = '+';
                                    bgClass = 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
                                } else if (part.removed) {
                                    lNum = leftLineNum++;
                                    marker = '-';
                                    bgClass = 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
                                } else {
                                    lNum = leftLineNum++;
                                    rNum = rightLineNum++;
                                }

                                return (
                                    <tr key={`${idx}-${lineIdx}`} className={`border-b border-gray-100 dark:border-gray-700/50 hover:opacity-80 ${bgClass}`}>
                                        <td className="w-10 text-right pr-2 text-gray-400 select-none bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">{lNum}</td>
                                        <td className="w-10 text-right pr-2 text-gray-400 select-none bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">{rNum}</td>
                                        <td className="w-8 text-center select-none text-gray-500">{marker}</td>
                                        <td className="px-2 whitespace-pre-wrap w-full">{line}</td>
                                    </tr>
                                )
                            });
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <BackButton />
            <h1 className="text-3xl font-bold text-center mb-6">Code Compare / Diff</h1>

            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">Language (Highlighting)</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="plain-text">Plain Text</option>
                                <option value="json">JSON</option>
                                <option value="python">Python</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">Diff Mode</label>
                            <select
                                value={diffGranularity}
                                onChange={(e) => setDiffGranularity(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="line">Line-by-Line</option>
                                <option value="word">Word-by-Word</option>
                                <option value="json">JSON Auto-format</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">View Layout</label>
                            <select
                                value={diffMode}
                                onChange={(e) => setDiffMode(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="split">Split View</option>
                                <option value="unified">Unified View</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleSwap} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 rounded transition cursor-pointer">
                            Swap
                        </button>
                        <button onClick={handleClear} className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 text-red-700 dark:text-red-200 rounded transition cursor-pointer">
                            Clear
                        </button>
                    </div>
                </div>

                {/* Editors */}
                <div className="flex flex-col md:flex-row gap-4 h-[40vh] min-h-[300px]">
                    <Editor
                        title="Editor 1"
                        value={originalCode}
                        onChange={setOriginalCode}
                        language={language}
                    />
                    <Editor
                        title="Editor 2"
                        value={modifiedCode}
                        onChange={setModifiedCode}
                        language={language}
                    />
                </div>

                {/* Stats Bar */}
                {(originalCode || modifiedCode) ? (
                    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-sm">
                        <span className="font-semibold">Differences:</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">+{additions} Additions</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">-{deletions} Deletions</span>
                    </div>
                ) : null}

                {/* Diff Viewer */}
                <div className="flex-1 overflow-hidden flex flex-col mb-8">
                    <h3 className="text-lg font-medium mb-2">Diff Output</h3>
                    {diffMode === 'split' ? renderSplitView() : renderUnifiedView()}
                </div>
            </div>
        </div>
    );
}
