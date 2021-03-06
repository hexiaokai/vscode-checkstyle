// Copyright (c) jdneo. All rights reserved.
// Licensed under the GNU LGPLv3 license.

import { Diagnostic, DiagnosticCollection, DiagnosticSeverity, Disposable, languages, Range, Uri } from 'vscode';
import { ICheckstyleResult } from './models';

class CheckstyleDiagnosticCollector implements Disposable {
    private diagnosticCollection: DiagnosticCollection;

    constructor() {
        this.diagnosticCollection = languages.createDiagnosticCollection('Checkstyle');
    }

    public addDiagnostics(uri: Uri, violations: ICheckstyleResult[]): void {
        const diagnostics: Diagnostic[] = [];
        for (const violation of violations) {
            const startLine: number = Math.max(violation.line - 1, 0);
            const startCharacter: number = Math.max(violation.column - 1, 0);
            diagnostics.push({
                range: new Range(startLine, startCharacter, startLine + 1, 0),
                message: violation.message,
                severity: this.parseDiagnosticSeverity(violation.severity),
                source: 'Checkstyle',
                code: violation.sourceName,
            });
        }
        this.diagnosticCollection.set(uri, diagnostics);
    }

    public getDiagnostics(uri: Uri): Diagnostic[] | undefined {
        return this.diagnosticCollection.get(uri);
    }

    public delete(uri: Uri): void {
        this.diagnosticCollection.delete(uri);
    }

    public dispose(): void {
        if (this.diagnosticCollection) {
            this.diagnosticCollection.clear();
            this.diagnosticCollection.dispose();
        }
    }

    private parseDiagnosticSeverity(severity: string): DiagnosticSeverity {
        switch (severity.toLocaleLowerCase()) {
            case 'info':
                return DiagnosticSeverity.Information;
            case 'warning':
                return DiagnosticSeverity.Warning;
            case 'error':
            default:
                return DiagnosticSeverity.Error;
        }
    }

}

export const checkstyleDiagnosticCollector: CheckstyleDiagnosticCollector = new CheckstyleDiagnosticCollector();
